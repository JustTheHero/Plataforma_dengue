// Go Worker - main.go
package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/lib/pq"
)

func main() {
	connStr := "postgres://postgres:postgres@localhost:5432/Plataforma_dengue"

	// Conectar ao PostgreSQL
	db, _ := sql.Open("postgres", connStr)
	defer db.Close()

	// Criar listener
	listener := pq.NewListener(
		connStr,
		10*time.Second,
		time.Minute,
		func(ev pq.ListenerEventType, err error) {
			if err != nil {
				log.Println("Listener error:", err)
			}
		},
	)
	defer listener.Close()

	// Escutar canais
	listener.Listen("new_case_correlation")
	listener.Listen("new_visit_correlation")

	log.Println("🚀 Go Worker listening for notifications...")

	// Loop principal
	for {
		select {
		case notification := <-listener.Notify:
			handleNotification(db, notification)

		case <-time.After(90 * time.Second):
			// Ping para manter conexão viva
			listener.Ping()

			// Processar jobs pendentes (fallback)
			processPendingJobs(db)
		}
	}
}

func handleNotification(db *sql.DB, n *pq.Notification) {
	log.Printf("📬 Received: %s -> %s", n.Channel, n.Extra)

	switch n.Channel {
	case "new_case_correlation":
		processCaseCorrelation(db, n.Extra) // case_id

	case "new_visit_correlation":
		processVisitCorrelation(db, n.Extra) // visit_id
	}
}

func processCaseCorrelation(db *sql.DB, caseID string) {
	start := time.Now()

	// Buscar jobs pendentes para este caso
	rows, err := db.Query(`
        SELECT id, parameters 
        FROM job_execution 
        WHERE job_type = 'correlation' 
          AND status = 'pending'
          AND parameters->>'case_id' = $1
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    `, caseID)

	if err != nil {
		log.Printf("❌ Error fetching job: %v", err)
		return
	}
	defer rows.Close()

	if !rows.Next() {
		log.Println("⚠️  No pending jobs for case", caseID)
		return
	}

	var jobID string
	var params string
	rows.Scan(&jobID, &params)

	// Processar correlações via procedure SQL
	_, err = db.Exec(`CALL process_case_correlations($1, $2)`, caseID, jobID)

	if err != nil {
		log.Printf("❌ Error processing correlations: %v", err)

		// Atualizar job como failed
		db.Exec(`
            UPDATE job_execution 
            SET status = 'failed', 
                error_message = $1,
                completed_at = NOW()
            WHERE id = $2
        `, err.Error(), jobID)

		return
	}

	elapsed := time.Since(start)
	log.Printf("✅ Processed case %s in %v", caseID, elapsed)
}

func processVisitCorrelation(db *sql.DB, visitID string) {
	// Similar a processCaseCorrelation
	_, err := db.Exec(`CALL process_visit_correlations($1)`, visitID)

	if err != nil {
		log.Printf("❌ Error: %v", err)
		return
	}

	log.Printf("✅ Processed visit %s", visitID)
}

func processPendingJobs(db *sql.DB) {
	// Fallback: processar jobs que não foram notificados
	rows, err := db.Query(`
        SELECT get_pending_jobs('correlation', 10)
    `)

	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		var jobID, jobName, jobType, params string
		rows.Scan(&jobID, &jobName, &jobType, &params)

		log.Printf("🔄 Processing pending job: %s", jobID)
		// Processar job...
	}
}

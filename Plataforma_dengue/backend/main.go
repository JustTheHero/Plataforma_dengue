package main

import (
	"fmt"
	"log"
	"net/http"
)

// arquivos serão do tipo fihr, com banco linkado em postgresql, verificar como fazer o login se vai usar
// firebase ou outra coisa que o dilvan falar
func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		h(w, r)
	}
}
func testHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "test")
}

func numbersHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, 123)
}
func main() {
	http.HandleFunc("/test", withCORS(testHandler))
	http.HandleFunc("/numbers", withCORS(numbersHandler))
	fmt.Println("Hello World")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

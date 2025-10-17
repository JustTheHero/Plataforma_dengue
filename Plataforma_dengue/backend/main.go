package main

import (
	"fmt"
	"log"
	"net/http"
)

func testHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "test")
}
func main() {
	fmt.Println("Hello World")
	http.HandleFunc("/test", testHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

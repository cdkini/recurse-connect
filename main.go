package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/cdkini/recurse-connect/server/config"
	"github.com/cdkini/recurse-connect/server/router"
	"github.com/joho/godotenv"
)

func main() {
	// Load env variables into scope for DB
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Could not read environment variables from file: %s", err)
	}

	// Connect to database
	connectionString := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("APP_DB_USERNAME"), os.Getenv("APP_DB_PASSWORD"), os.Getenv("APP_DB_NAME"))

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Could not obtain connection to database: %v", err)
	}

	// Initialize environment, router, and server
	env := config.NewEnv(db)
	r := router.Initialize(env)
	port := ":5000"

	srv := &http.Server{
		Handler: r,
		Addr:    fmt.Sprintf("127.0.0.1%s", port),
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// Start server on desired port
	fmt.Printf("Running server on http://127.0.0.1%s\n", port)
	go func() {
		err := srv.ListenAndServe()
		if err != nil {
			log.Fatal(err)
		}
	}()

	// Trap sigterm or interrupt to gracefully shutdown server
	sigChan := make(chan os.Signal)
	signal.Notify(sigChan, os.Interrupt)
	signal.Notify(sigChan, os.Kill)

	sig := <-sigChan // Blocking
	log.Println("Received termination, gracefully shut down", sig)

	// Wait a maximum of 30 seconds while cleaning up
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	srv.Shutdown(ctx)
}

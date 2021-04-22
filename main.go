package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"

	"os"

	"github.com/cdkini/recurse-connect/server"
	"github.com/cdkini/recurse-connect/server/database"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

func main() {
	// Load env variables into scope
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Could not read environment variables from file: %s", err)
	}

	// Connect to database
	connectionString := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("APP_DB_USERNAME"), os.Getenv("APP_DB_PASSWORD"), os.Getenv("APP_DB_NAME"))

	conn, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	if err = conn.Ping(); err != nil {
		log.Fatalf("Could not obtain connection to database: %v", err)
	}

	postgres := database.NewPostgresDB(conn)

	// Configure logger and have it both print to STDOUT and write to a log file
	logger := &log.Logger{}

	f, err := os.OpenFile("rc.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
	}
	defer f.Close()

	mw := io.MultiWriter(os.Stdout, f)
	logger.SetOutput(mw)

	// Initialize mux router and server
	store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
	server := server.NewServer(postgres, logger, store)
	r := server.Route()
	port := os.Getenv("APP_PORT")

	// Run application!
	server.ListenAndServe(r, port)
}

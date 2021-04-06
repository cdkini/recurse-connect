package main

import (
	"log"
	// "os"

	"github.com/cdkini/recurse-connect/server"
	"github.com/joho/godotenv"
)

func main() {
	app := server.NewApp()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// app.Initialize(
	// 	os.Getenv("APP_DB_USERNAME"),
	// 	os.Getenv("APP_DB_PASSWORD"),
	// 	os.Getenv("APP_DB_NAME"),
	// )

	app.Router.HandleFunc("/api/v1/health", server.Health)
	app.Router.HandleFunc("/api/v1/login", server.Login)
	app.Router.HandleFunc("/api/v1/auth", server.Auth)

	spa := server.NewSPAHandler("client/build", "index.html")
	app.Router.PathPrefix("/").Handler(spa)

	app.Run(":5000")
}

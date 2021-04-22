package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

// Server encapsulates all the objects necessary to facilitate key server-side activities, 
// including database querying and updating, logging, and session management.
type Server struct {
	DB     database.DB
	Logger *log.Logger
	Store  *sessions.CookieStore
}

func NewServer(db database.DB, logger *log.Logger, store *sessions.CookieStore) *Server {
	return &Server{DB: db, Logger: logger, Store: store}
}

// ListenAndServe runs the actual server until termination (where it gracefully exits any running processes)
func (s *Server) ListenAndServe(r *mux.Router, port string) {
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

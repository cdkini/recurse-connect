package server

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/cdkini/recurse-connect/server/handlers"
	"github.com/cdkini/recurse-connect/server/middleware"
	"github.com/gorilla/mux"
)

// Route establishes all API endpoint routes and allows for the handling of static client-side files
func (s *Server) Route() *mux.Router {
	r := mux.NewRouter()
	s.initializeRoutes(r)
	spa := &spaHandler{"client/build", "index.html"}
	r.PathPrefix("/").Handler(spa)
	return r
}

// spaHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type spaHandler struct {
	staticPath string
	indexPath  string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// If we failed to get the absolute path respond with a 400 bad request
		// and stop
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, path)

	// Check whether a file exists at the given path
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// File does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		// If we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func (s *Server) initializeRoutes(r *mux.Router) {
	// Apply universal middleware
	r.Use(middleware.LogRequest(), middleware.SetContentSecurityPolicy(), middleware.SetContentType())

	// OAuth endpoints
	r.HandleFunc("/api/v1/login", s.Login)
	r.HandleFunc("/api/v1/auth", s.Auth)

	// Misc endpoints
	r.HandleFunc("/api/v1/health", s.health())
	r.HandleFunc("/api/v1/whoami", s.whoami())

	// Apply middleware for protected endpoints through subrouter
	sub := r.PathPrefix("/api/v1/users").Subrouter()
	sub.Use(middleware.AuthCheck(s.Store), middleware.ConfigureCORS())

	// Recurser graph endpoints
	sub.HandleFunc("/graph", s.getGraph()).Methods(http.MethodGet)

	// Note endpoints
	sub.HandleFunc("/{userId:[0-9]+}/notes", s.getNotes()).Methods(http.MethodGet)
	sub.HandleFunc("/{userId:[0-9]+}/notes", s.postNote()).Methods(http.MethodPost)
	sub.HandleFunc("/{userId:[0-9]+}/notes/{noteId:[0-9]+}", s.putNote()).Methods(http.MethodPut)
	sub.HandleFunc("/{userId:[0-9]+}/notes/{noteId:[0-9]+}", s.deleteNote()).Methods(http.MethodDelete)

	// Tag endpoints
	sub.HandleFunc("/{userId:[0-9]+}/tags", s.getTags()).Methods(http.MethodGet)
	sub.HandleFunc("/{userId:[0-9]+}/tags", s.postTag()).Methods(http.MethodPost)
	sub.HandleFunc("/{userId:[0-9]+}/tags/{tagId:[0-9]+}", s.deleteTag()).Methods(http.MethodDelete)
}

/*
 * The purpose behind passing server attributes to handlers rather than using server struct receivers is to decouple
 * the application logic and have an entirely separate package for the testing and implementation of handlers.
 *
 * The below functions are simply injecting the relevant dependencies from the server struct into each handler.
 * TODO: This feels a bit like an antipattern so I'll mark this open to revisit!
 */

func (s *Server) health() http.HandlerFunc {
	return handlers.Health(s.Logger)
}

func (s *Server) whoami() http.HandlerFunc {
	return handlers.Whoami(s.Logger, s.Store)
}

func (s *Server) getGraph() http.HandlerFunc {
	return handlers.GetGraph(s.DB, s.Logger)
}

func (s *Server) getNotes() http.HandlerFunc {
	return handlers.GetNotes(s.DB, s.Logger)
}

func (s *Server) postNote() http.HandlerFunc {
	return handlers.PostNote(s.DB, s.Logger)
}

func (s *Server) putNote() http.HandlerFunc {
	return handlers.PutNote(s.DB, s.Logger)
}

func (s *Server) deleteNote() http.HandlerFunc {
	return handlers.DeleteNote(s.DB, s.Logger)
}

func (s *Server) getTags() http.HandlerFunc {
	return handlers.GetTags(s.DB, s.Logger)
}

func (s *Server) postTag() http.HandlerFunc {
	return handlers.PostTag(s.DB, s.Logger)
}

func (s *Server) deleteTag() http.HandlerFunc {
	return handlers.DeleteTag(s.DB, s.Logger)
}

package router

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/cdkini/recurse-connect/server/config"
	"github.com/cdkini/recurse-connect/server/handlers"
	"github.com/cdkini/recurse-connect/server/middleware"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func Initialize(env *config.Env) *mux.Router {
	r := mux.NewRouter()
	InitializeRoutes(r, env)
	spa := NewSPAHandler("client/build", "index.html")
	r.PathPrefix("/").Handler(spa)
	return r
}

func InitializeRoutes(r *mux.Router, env *config.Env) {
	// Apply universal middleware
	r.Use(middleware.LogRequest(r))

	// Just to test that the API is actually reachable
	r.Handle("/api/v1/health", handlers.Health(env))

	// OAuth endpoints
	r.Handle("/api/v1/login", handlers.Login(env))
	r.Handle("/api/v1/auth", handlers.Auth(env))
	r.Handle("/api/v1/whoami", handlers.Whoami(env))

	// Apply middleware for protected endpoints through subrouter
	s := r.PathPrefix("/api/v1/users").Subrouter()
	s.Use(middleware.AuthCheck(r, env))

	// Recurser endpoints
	s.Handle("/", handlers.GetMultipleProfiles(env)).Methods(http.MethodGet)
	s.Handle("/{userId:[0-9]+}", handlers.GetProfile(env)).Methods(http.MethodGet)

	// Note endpoints
	s.Handle("/{userId:[0-9]+}/notes", handlers.GetNotes(env)).Methods(http.MethodGet)
	s.Handle("/{userId:[0-9]+}/notes", handlers.PostNote(env)).Methods(http.MethodPost)
	s.Handle("/{userId:[0-9]+}/notes/{noteId:[0-9]+}", handlers.PutNote(env)).Methods(http.MethodGet)
	s.Handle("/{userId:[0-9]+}/notes/{noteId:[0-9]+}", handlers.DeleteNote(env)).Methods(http.MethodDelete)

	// Tag endpoints
	s.Handle("/{userId:[0-9]+}/tags", handlers.GetTags(env)).Methods(http.MethodGet)
	s.Handle("/{userId:[0-9]+}/tags", handlers.PostTag(env)).Methods(http.MethodPost)
	s.Handle("/{userId:[0-9]+}/tags/{tagId:[0-9]+}", handlers.DeleteTag(env)).Methods(http.MethodDelete)
}

// SPAHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type SPAHandler struct {
	staticPath string
	indexPath  string
}

func NewSPAHandler(staticPath string, indexPath string) *SPAHandler {
	return &SPAHandler{staticPath, indexPath}
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h *SPAHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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

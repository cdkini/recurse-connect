package middleware

import (
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// SetContentType ensures that outgoing responses are converted to JSON
func SetContentType() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	}
}

// SetContentSecurityPolicy limits the scope of what a user agent can load from a page
func SetContentSecurityPolicy() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			csp := []string{"default-src: 'self'", "font-src: 'fonts.googleapis.com'", "frame-src: 'none'"}
			// header := http.Header{
			// 	"Content-Type": {"text/html; charset=UTF-8"},
			// }
			w.Header().Set("Content-Security-Policy", strings.Join(csp, "; "))
			next.ServeHTTP(w, r)
		})
	}
}

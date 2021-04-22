package middleware

import (
	"net/http"

	"github.com/gorilla/mux"
)

// ConfigureCORS limits cross origin traffic to just the client-side.
// Note that this is only used in development; the production build runs both the server-side and client-side on the same port.
func ConfigureCORS() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "127.0.0.1:3000")
			next.ServeHTTP(w, r)
		})
	}
}

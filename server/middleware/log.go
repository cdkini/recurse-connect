package middleware

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type statusResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

// NewStatusResponseWriter returns pointer to a new statusResponseWriter object
func NewStatusResponseWriter(w http.ResponseWriter) *statusResponseWriter {
	return &statusResponseWriter{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
	}
}

// WriteHeader assigns status code and header to ResponseWriter of statusResponseWriter object
func (sw *statusResponseWriter) WriteHeader(statusCode int) {
	sw.statusCode = statusCode
	sw.ResponseWriter.WriteHeader(statusCode)
}

func LogRequest(r *mux.Router) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			start := time.Now()
			sw := NewStatusResponseWriter(w)
			defer func() {
				log.Printf(
					"[%s] [%v] [%d] %s %s %s",
					req.Method,
					time.Since(start),
					sw.statusCode,
					req.Host,
					req.URL.Path,
					req.URL.RawQuery,
				)
			}()
			next.ServeHTTP(sw, req)
		})
	}
}

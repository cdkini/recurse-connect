package middleware

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// LogRequest logs formatted strings in response to HTTP requests
// Ex: 2021/04/21 22:07:59 [GET] [15.272694ms] [200] 127.0.0.1:5000 /api/v1/users/graph
func LogRequest() mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			start := time.Now()
			sw := newStatusResponseWriter(w)
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

// statusReponseWriter aids our logging by determining the status code of a given response and writing it to our log output
type statusResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func newStatusResponseWriter(w http.ResponseWriter) *statusResponseWriter {
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

package handlers_test

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/cdkini/recurse-connect/server/models"
	"github.com/cdkini/recurse-connect/server/handlers"
)

func (m *mockDB) ReadGraph(start time.Time, end time.Time, graph *models.Graph) error {
	return nil
}

func TestGetGraph(t *testing.T) {
	tt := []struct {
		name string
		url  string
		args map[string]string
		code int
	}{
		{
			name: "Valid request with dates",
			url:  "localhost:5000/api/v1/users?startDate=03-01-2020&endDate=04-01-2020",
			args: map[string]string{"startDate": "2020-03-01", "endDate": "2020-04-01"},
			code: 200,
		},
		{
			name: "Valid request without dates",
			url:  "localhost:5000/api/v1/users",
			args: map[string]string{},
			code: 200,
		},
		{
			name: "Wrong date format",
			url:  "localhost:5000/api/v1/users?startDate=2020-03-01&endDate=2020-04-01",
			args: map[string]string{"startDate": "03-01-2020", "endDate": "04-01-2020"},
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("GET", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			queryValues := req.URL.Query()
			for key, val := range tc.args {
				queryValues.Set(key, val)
			}
			req.URL.RawQuery = queryValues.Encode()

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.GetGraph(db, logger)
			handler(rec, req)

			res := rec.Result()
			defer res.Body.Close()

			_, err = ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("Could not read response: %v", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("Expected status %v; got %v", tc.code, res.StatusCode)
			}
		})
	}
}


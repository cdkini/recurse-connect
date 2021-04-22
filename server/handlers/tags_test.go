package handlers_test

import (
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cdkini/recurse-connect/server/handlers"
	"github.com/cdkini/recurse-connect/server/models"
	"github.com/gorilla/mux"
)

func (m *mockDB) ParseTag(body io.Reader, tag *models.Tag) error   { return nil }
func (m *mockDB) ReadTags(userId int, tags []*models.Tag) error    { return nil }
func (m *mockDB) PostTag(userId int, tag *models.Tag) (int, error) { return -1, nil }
func (m *mockDB) DeleteTag(userId int, tagId int) error            { return nil }

func TestGetTags(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/tags",
			vars: map[string]string{"userId": "3721"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/tags",
			vars: nil,
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("GET", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.GetTags(db, logger)
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

func TestPostTag(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/tags",
			vars: map[string]string{"userId": "3721"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/tags",
			vars: nil,
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("POST", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.PostTag(db, logger)
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

func TestDeleteTag(t *testing.T) {
	tt := []struct {
		name string
		url  string
		vars map[string]string
		code int
	}{
		{
			name: "Valid request",
			url:  "localhost:5000/api/v1/users/3721/tags/123",
			vars: map[string]string{"userId": "3721", "tagId": "123"},
			code: 200,
		},
		{
			name: "Invalid userId",
			url:  "localhost:5000/api/v1/users/NaN/tags/123",
			vars: map[string]string{"tagId": "123"},
			code: 400,
		},
		{
			name: "Invalid noteId",
			url:  "localhost:5000/api/v1/users/3721/tags/NaN",
			vars: map[string]string{"userId": "3721"},
			code: 400,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			req, err := http.NewRequest("DELETE", tc.url, nil)
			if err != nil {
				t.Fatalf("Could not create request: %v", err)
			}

			req = mux.SetURLVars(req, tc.vars)

			db, logger, _ := setup(t)
			rec := httptest.NewRecorder()
			handler := handlers.DeleteTag(db, logger)
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

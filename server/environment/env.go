package environment

import (
	"database/sql"
	"log"
	"os"

	"github.com/gorilla/sessions"
)

// Env is a wrapper around a DB connection, loger, session store, and any env variables.
// It is passed to HTTP handlers to facilitate dependency injection.
type Env struct {
	DB     *sql.DB
	Logger *log.Logger
	Store  *sessions.CookieStore
	Vars   *envVars
}

type envVars struct {
	AccessTokenURL string
	APIBaseURL     string
	AuthorizeURL   string
	ClientId       string
	ClientSecret   string
	RedirectURL    string
}

func NewEnv(db *sql.DB, logger *log.Logger, store *sessions.CookieStore) *Env {
	vars := &envVars{
		AccessTokenURL: os.Getenv("ACCESS_TOKEN_URL"),
		APIBaseURL:     os.Getenv("API_BASE_URL"),
		AuthorizeURL:   os.Getenv("AUTHORIZE_URL"),
		ClientId:       os.Getenv("CLIENT_ID"),
		ClientSecret:   os.Getenv("CLIENT_SECRET"),
		RedirectURL:    os.Getenv("REDIRECT_URL"),
	}

	return &Env{db, logger, store, vars}
}

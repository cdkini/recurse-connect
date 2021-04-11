package config

import (
	"database/sql"
	"log"
	"os"

	"github.com/gorilla/sessions"
)

type Env struct {
	DB     *sql.DB
	Logger *log.Logger
	Vars   *EnvVars
	Store  *sessions.CookieStore
}

type EnvVars struct {
	AccessTokenURL string
	APIBaseURL     string
	AuthorizeURL   string
	ClientId       string
	ClientSecret   string
	RedirectURL    string
}

func NewEnv(db *sql.DB) *Env {
	logger := &log.Logger{}
	vars := &EnvVars{
		AccessTokenURL: os.Getenv("ACCESS_TOKEN_URL"),
		APIBaseURL:     os.Getenv("API_BASE_URL"),
		AuthorizeURL:   os.Getenv("AUTHORIZE_URL"),
		ClientId:       os.Getenv("CLIENT_ID"),
		ClientSecret:   os.Getenv("CLIENT_SECRET"),
		RedirectURL:    os.Getenv("REDIRECT_URL"),
	}
	store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

	return &Env{db, logger, vars, store}
}

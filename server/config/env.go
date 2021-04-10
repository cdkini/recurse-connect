package config

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
)

// A (simple) example of our application-wide configuration.
type Env struct {
	DB     *sql.DB
	Logger *log.Logger
	Vars   *EnvVars
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
	// Load environment variables into environment
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Could not read environment variables from file: %s", err)
	}

	vars := &EnvVars{
		AccessTokenURL: os.Getenv("ACCESS_TOKEN_URL"),
		APIBaseURL:     os.Getenv("API_BASE_URL"),
		AuthorizeURL:   os.Getenv("AUTHORIZE_URL"),
		ClientId:       os.Getenv("CLIENT_ID"),
		ClientSecret:   os.Getenv("CLIENT_SECRET"),
		RedirectURL:    os.Getenv("REDIRECT_URL"),
	}

	return &Env{db, &log.Logger{}, vars}

}

package handlers

import (
	"database/sql"
	"encoding/json"
	"github.com/cdkini/recurse-connect/server/config"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type Profile struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	ProfilePath string `json:"profilePath"`
	ImagePath   string `json:"imagePath"`
	Location    string `json:"location"`
	Company     string `json:"company"`
	Bio         string `json:"bio"`
	Interests   string `json:"interests"`
	BeforeRc    string `json:"beforeRc"`
	DuringRc    string `json:"duringRc"`
	Email       string `json:"email"`
	GitHub      string `json:"github"`
	Twitter     string `json:"twitter"`
}

type Profiles []*Profile

// Endpoint: /api/v1/users/:userId
func GetProfile(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		// FIXME: Implement!
		// If overlapping, get only overlapping to user else get ALL
		query := `
    SELECT profiles.id, profiles.name, profiles.profile_path, profiles.image_path, locations.name, companies.name, 
    profiles.bio, profiles.interests, profiles.before_rc, profiles.during_rc, profiles.email, profiles.github, profiles.twitter
    FROM profiles 
    LEFT OUTER JOIN locations
    `
		row := env.DB.QueryRow(query, userId)

		var profile Profile
		err = row.Scan(
			&profile.Id, &profile.Name, &profile.ProfilePath, &profile.ImagePath, &profile.Location,
			&profile.Company, &profile.Bio, &profile.Interests, &profile.BeforeRc, &profile.DuringRc,
			&profile.Email, &profile.GitHub, &profile.Twitter,
		)
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		json.NewEncoder(w).Encode(profile)
	})
}

// Endpoint: /api/v1/users
func GetMultipleProfiles(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		urlParams := r.URL.Query()
		overlap := urlParams.Get("overlap")

		// TODO: Implement!
		var rows *sql.Rows
		if len(overlap) == 0 {
		} else {

		}

		defer rows.Close()

		var profiles Profiles

		for rows.Next() {
			var profile *Profile

			err := rows.Scan(
				&profile.Id, &profile.Name, &profile.ProfilePath, &profile.ImagePath, &profile.Location,
				&profile.Company, &profile.Bio, &profile.Interests, &profile.BeforeRc, &profile.DuringRc,
				&profile.Email, &profile.GitHub, &profile.Twitter,
			)
			if err != nil {
				log.Fatalf("Unable to scan the row: %v", err)
			}

			profiles = append(profiles, profile)
		}

		json.NewEncoder(w).Encode(profiles)
	})
}

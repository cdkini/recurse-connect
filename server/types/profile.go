package types

import (
	"encoding/json"
	"io"

	"github.com/go-playground/validator"
)

type Profile struct {
	Id          int    `json:"id" validate:"required,numeric"`
	Name        string `json:"name" validate:"required,alpha"`
	ProfilePath string `json:"profilePath" validate:"required,url"`
	ImagePath   string `json:"imagePath" validate:"required,url"`
	Location    string `json:"location" validate:"alpha"`
	Company     string `json:"company" validate:"alpha"`
	Bio         string `json:"bio" validate:"alpha"`
	Interests   string `json:"interests" validate:"alpha"`
	BeforeRc    string `json:"beforeRc" validate:"alpha"`
	DuringRc    string `json:"duringRc" validate:"alpha"`
	Email       string `json:"email" validate:"email"`
	GitHub      string `json:"github" validate:"url"`
	Twitter     string `json:"twitter" validate:"url"`
}

type Profiles []*Profile

func (p *Profile) FromJSON(r io.Reader) error {
	return json.NewDecoder(r).Decode(p)
}

func (p *Profile) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(p)
}

func (p *Profiles) ToJSON(w io.Writer) error {
	return json.NewEncoder(w).Encode(p)
}

func (p *Profile) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}

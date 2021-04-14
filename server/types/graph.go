package types

import (
	"time"
)

// type Node interface {
// 	ToJSON(io.Writer) error
// 	FromJSON(io.Reader) error
// }

type RecurserNode struct {
	Id             int        `json:"id"`
	Name           *string    `json:"name"`
	ProfilePath    *string    `json:"profilePath"`
	ImagePath      *string    `json:"imagePath"`
	Location       *string    `json:"location"`
	Company        *string    `json:"company"`
	Bio            *string    `json:"bio"`
	Interests      *string    `json:"interests"`
	BeforeRc       *string    `json:"beforeRc"`
	DuringRc       *string    `json:"duringRc"`
	Email          *string    `json:"email"`
	GitHub         *string    `json:"github"`
	Twitter        *string    `json:"twitter"`
	BatchName      *string    `json:"batchName"`
	BatchShortName *string    `json:"batchShortName"`
	StartDate      *time.Time `json:"startDate"`
	EndDate        *time.Time `json:"endDate"`
}

type BatchNode struct {
	Id        int        `json:"id"`
	Name      string     `json:"name"`
	StartDate *time.Time `json:"startDate"`
	EndDate   *time.Time `json:"endDate"`
}

type Edge struct {
	To     int `json:"to"`
	From   int `json:"from"`
	Weight int `json:"weight"`
}

func NewEdge(to, from, weight int) *Edge {
	return &Edge{to, from, weight}
}

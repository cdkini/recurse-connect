package database

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

// TODO: Database tests need some work!

func setup(t *testing.T) (*PostgresDB, sqlmock.Sqlmock, func()) {
	conn, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("An error '%s' was not expected when opening a stub database connection", err)
	}

	pg := NewPostgresDB(conn)
	teardown := func() {
		conn.Close()
	}

	return pg, mock, teardown
}

// TODO: Implement!
func TestUpdateRecurserNodeDates(t *testing.T) {}

// TODO: Implement!
func TestGetBatchNodes(t *testing.T) {}

// TODO: Implement!
func TestGetEdges(t *testing.T) {}

func TestDetermineOverlap(t *testing.T) {
	loc, err := time.LoadLocation("EST")
	if err != nil {
		t.Fatalf("Could not establish EST timezone: %v", err)
	}

	tt := []struct {
		name   string
		startA time.Time
		startB time.Time
		endA   time.Time
		endB   time.Time
		want   int
	}{
		{
			name:   "A and B do not overlap",
			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
			startB: time.Date(2020, 5, 1, 0, 0, 0, 0, loc),
			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
			want:   -15,
		},
		{
			name:   "A envelopes B",
			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			endA:   time.Date(2020, 9, 15, 0, 0, 0, 0, loc),
			startB: time.Date(2020, 5, 1, 0, 0, 0, 0, loc),
			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
			want:   138,
		},
		{
			name:   "A intersects with B",
			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
			startB: time.Date(2020, 2, 1, 0, 0, 0, 0, loc),
			endB:   time.Date(2020, 7, 15, 0, 0, 0, 0, loc),
			want:   75,
		},
		{
			name:   "A and B are the same ranges",
			startA: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			endA:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
			startB: time.Date(2020, 1, 1, 0, 0, 0, 0, loc),
			endB:   time.Date(2020, 4, 15, 0, 0, 0, 0, loc),
			want:   106,
		},
	}

	for _, tc := range tt {
		t.Run(tc.name, func(t *testing.T) {

			got := determineOverlap(&tc.startA, &tc.endA, &tc.startB, &tc.endB)

			if got != tc.want {
				t.Errorf("Wanted an overlap of %v, got %v", tc.want, got)
			}
		})
	}
}

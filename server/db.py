import requests
import time

from api import db, models, secrets
from datetime import datetime

connections = 0


def get_profiles(access_token):
    """Accesses the Recurse API to obtain and aggregate information about individual participants.
    These details are written to a list for subsequent usage.
    See https://github.com/recursecenter/wiki/wiki/Recurse-Center-API for more details.

    Args:
        access_token (str): User specific authentication provided by Recurse API.

    Returns:
        list[str]: JSON-formatted strings representing individual user profiles.

    Raises:
        HTTPError: Raised if GET request fails for any reason.

    """
    start = time.time()

    offset = 0
    profiles = []

    while True:
        r = requests.get(
            f"https://www.recurse.com/api/v1/profiles/?limit=50&offset={offset}&access_token={access_token}"
        )
        r.raise_for_status()

        response = r.json()
        if len(response) == 0:
            break

        for profile in response:
            profiles.append(profile)

        offset += len(response)  # API maxes out at 50 profiles per GET

    end = time.time()
    print(
        f"Successfully requested {offset:,} profiles from API in {end - start:.2f} seconds"
    )

    return profiles


def update_db(profiles, db):
    """Updates all database tables with profile details obtained from API.

    Each table update invokes a private helper method. These tables include:
      - Profile:     Individual participant and their details. Primary table for information.
      - Location:    Current city/state/country participant is located in.
      - Batch:       Which Recurse-defined period the participant has attended (Winter 1, Winter 2, etc).
      - Stint:       The specific days in which the participant has attended a given batch.
      - Company:     Where the participant currently works.

    Args:
        profiles (list[str]):  JSON data about participants as gathered from API.
        db (SQLAlchemy):       Database instance used to store the above details in relevant tables.

    Returns:
        None

    """
    start = time.time()

    visited_batches = []

    for profile in profiles:
        _update_profile_table(profile, db)
        _update_location_table(profile, db)
        _update_batch_and_stint_tables(profile, db)
        _update_company_table(profile, db)

    db.session.commit()

    end = time.time()
    print(
        f"Successfully updated database entries in {end - start:.2f} seconds")
    print(f"  - 'profile' table: {models.Profile.query.count():,} rows")
    print(f"  - 'location' table: {models.Location.query.count():,} rows")
    print(f"  - 'stint' table: {models.Stint.query.count():,} rows")
    print(f"  - 'batch' table: {models.Batch.query.count():,} rows")
    print(f"  - 'company' table: {models.Company.query.count():,} rows")


def _update_profile_table(profile, db):
    profile_id = profile.get("id")
    name = profile.get("name")
    profile_path = f"www.recurse.com/directory/{profile.get('slug')}"
    image_path = profile.get("image_path")

    bio = profile.get("bio_hl")
    interests = profile.get("interests_hl")
    before_rc = profile.get("before_rc_hl")
    during_rc = profile.get("during_rc_hl")

    email = profile.get("email_hl")
    github = profile.get("github")
    if github:
        github = f"github.com/{github}"
    twitter = profile.get("twitter")
    if twitter:
        twitter = f"twitter.com/{twitter}"

    location = profile.get("current_location")
    location_id = None if not location else location.get("id")

    company = profile.get("company ")
    company_id = None if not company else company.get("id")

    profile_entry = models.Profile(
        id=profile_id,
        name=name,
        profile_path=profile_path,
        image_path=image_path,
        interests=interests,
        location_id=location_id,
        company_id=company_id,
        before_rc=before_rc,
        bio=bio,
        during_rc=during_rc,
        email=email,
        github=github,
        twitter=twitter
    )
    db.session.merge(profile_entry)


def _update_location_table(profile, db):
    location = profile.get("current_location")
    if not location:
        return

    loc_id = location.get("id")
    name = location.get("name")

    location_entry = models.Location(id=loc_id, name=name)
    db.session.merge(location_entry)


def _update_batch_and_stint_tables(profile, db):
    profile_id = profile.get("id")

    stints = profile.get("stints")
    for stint in stints:
        batch = stint.get("batch")
        if not batch:
            continue  # Excludes facilitators and test users

        # Update 'Batch' db table
        batch_id = batch.get("id")
        name = batch.get("name")
        short_name = batch.get("short_name")

        batch_entry = models.Batch(
            id=batch_id, name=name, short_name=short_name)
        db.session.merge(batch_entry)

        # Update 'Stint' db table
        stint_id = stint.get("id")
        start_date = datetime.strptime(stint.get("start_date"), "%Y-%m-%d")
        end_date = datetime.strptime(stint.get("end_date"), "%Y-%m-%d")

        stint_entry = models.Stint(
            id=stint_id,
            start_date=start_date,
            end_date=end_date,
            batch_id=batch_id,
            profile_id=profile_id,
        )
        db.session.merge(stint_entry)


def _update_company_table(profile, db):
    company = profile.get("company")
    if not company:
        return

    company_id = company.get("id")
    name = company.get("name")

    company_entry = models.Company(id=company_id, name=name)
    db.session.merge(company_entry)


if __name__ == "__main__":
    start = time.time()
    profiles = get_profiles(secrets.TOKEN)
    update_db(profiles, db)
    end = time.time()
    print(f"Total script time: {end - start:.2f} seconds")

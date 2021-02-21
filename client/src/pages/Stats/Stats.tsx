import * as React from 'react';
// import Timeline from '@material-ui/lab/Timeline';
// import TimelineItem from '@material-ui/lab/TimelineItem';
// import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
// import TimelineConnector from '@material-ui/lab/TimelineConnector';
// import TimelineContent from '@material-ui/lab/TimelineContent';
// import TimelineDot from '@material-ui/lab/TimelineDot';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

// const recurseHistory = {
//     "Fall 2006": "Nick and Dave meet during their Signals & Systems class.",
//     "Summer 2007": "Nick and Sonali meet at Shakespeare in the Park (Sonali is friends with one of Nick's coworkers).",
//     "Spring 2008": "Nick and Dave begin having 'business meetings' after work to discuss starting a company.",
//     "May 2010": "Nick and Dave quit their programming jobs to start 'OkCupid for jobs'.",
//     "June to October 2010": "Nick and Dave live in Mountain View, CA and do Y Combinator. Paul Graham calls them 'self-indulgent' for wanting to move back to New York.",
//     "Fall 2010": "Sonali starts working with Nick and Dave on weekends.",
//     "February 2011": "Sonali leaves her cushy corporate job and salary to join the team full-time.",
//     "June 2011": "Dave has a long talk with Paul Graham, Sam Altman and Paul Buchheit about a 'school for hackers' and returns to New York ecstatic about the idea. We invite a small group of people to be part of an experiment called 'hacker school' (we didn't capitalize it because we considered the name temporary – we weren't sure how we felt about calling it a 'school').",
//     "July 16, 2011": "A third of the people who committed to doing the batch drop out two days before the start.",
//     "July 18, 2011": "The first day of 'Batch[0]' (aka the summer 2011 batch). The batch has only nine people including Nick, Dave, and Sonali, and is five weeks long. It's hosted in a small room at NYU with no windows. Alan is a Hacker Schooler and tries to explain monads to a very confused Nick and Dave. Sonali is the only woman.",
//     "August 2011": "John 'workmajj' Workman suggests 'Never graduate' as Hacker School's informal motto.",
//     "September 2011": "The second batch begins. We're hosted at Spotify in a slightly larger room with no windows.",
//     "February 2012": "The third batch begins with 20 Hacker Schoolers; Tom is among them. The batch is hosted at The Huffington Post. Danielle Sucher becomes the first Hacker School alumna.",
//     "May 2012": "We hire Tom and Alan as contractors to help facilitate the summer batch.",
//     "June 2012": "The summer batch begins with 53 Hacker Schoolers, among them are Allison, Zach and Mary. The batch is 45% women, and is hosted at Etsy.",
//     "August 2012": "Tom and Alan become regular employees and are joined by Zach and Allison.",
//     "October 2012": "Jessica McKellar, Peter Seibel, Alex Payne, Stefan Karpinski, and David Nolen are the first Residents.",
//     "February 2013": "We get our own space in Manhattan! The US government agrees that Mary is 'extraordinary' and grants her a work visa.",
//     "September 2013": "We move to an nicer space with lots of natural light and no fruit flies.",
//     "May 2014": "To encourage traditions to persist from batch to batch, we move to overlapping batches.",
//     "June 2014": "We hire our first dedicated operations person, Rachel.",
//     "November 2014": "Allison goes west to join Dropbox: An unusual goodbye.",
//     "March 2015": "We change our name from Hacker School to the Recurse Center.",
//     "May 2015": "Michael Nielsen joins the Recurse Center to help build a research lab.",
//     "August 2015": "Allie (W'13) and John (S'11) join RC as facilitators; Nancy joins as our first full-time Jobs Counselor.",
//     "March 2016": "Allie and John transition to our dev team. James (S'13) and Lisa (S'12) join RC as facilitators.",
//     "June 2016": "Rose (W'14) joins RC as a facilitator.",
//     "September 2016": "Allie moves on to work at Etsy, and John starts a new job at Eave. Lisa moves west and joins Pluot.",
//     "February 2017": "Rose leaves RC. James begins transitioning into a new role with more focus on making improvements to the Retreat.",
//     "March 2017": "Zach moves out of New York, and becomes our first remote employee. We relaunch our website with a snazzy new design.",
//     "July 2017": "Alicia (F1'15, F1'16) joins RC as a facilitator.",
//     "January 2018": "We introduce one-week mini retreats.",
//     "September 2018": "We move to a bigger space in Downtown Brooklyn.",
//     "March 2020": "We temporarily close our space and switch to running batches remotely for the first time due to COVID-19.",
//     "August 2020": "We decide to continue running remote batches for the foreseeable future, including when we're able to reopen our space.",
// }

interface Props {}

export const Stats: React.FC<Props> = () => {
	return (
		<div>
			<NavigationBar />
			<br />
			<br />
			<br />
			<br />
			<br />
			<div>RC TIMELINE</div>
			<div>Time since Batch[0] (Summer 2011): Years, Months, Weeks, Days</div>
			<div>Number of unique participants: </div>
			<div>Number of returning participants: </div>
			<div>Number of countries people are from:</div>
			<div>Companies</div>
			<br />
			<div>
				RECURSER TIMELINE: First day, last day, 1 year anniversary, 5 year
				anniversary, now
			</div>
			<div>Time you've been a Recurser</div>
			<div>Number of batches you've done</div>
			<div>Days you've spent at RC</div>
			<div>Number of people you've met</div>
		</div>
	);
};

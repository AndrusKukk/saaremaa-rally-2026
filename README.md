# Saaremaa Rally days

A flat weekend itinerary using plain HTML, CSS and JavaScript. Open `index.html` or run `python3 -m http.server 8000`. No build step, dependencies, or external fonts.

The day menu switches between separate Friday and Saturday timelines. Only the selected day is shown; Friday is the default. SS1, SS3, SS4, SS7 and SS9 are planned visits; other stages and official service events are muted information. Edit `plannedStages` in `app.js` to change your selection.

## Adding your plans

Edit stage objects in `app.js`. Optional fields:

```js
leaveAt: '2026-10-10T11:15:00+03:00', // Leave FOR this stage
travel: { drivingMinutes: 32, walkingMinutes: 10, earlyArrivalMinutes: 30 },
departureLabel: 'Latest departure from home',
videos: ['https://www.youtube.com/watch?v=VIDEO_ID'],
parking: 'https://www.google.com/maps/search/?api=1&query=LAT,LON',
spectating: 'https://www.google.com/maps/search/?api=1&query=LAT,LON',
parkingWaze: 'https://www.waze.com/ul?ll=LAT,LON&z=17',
spectatingWaze: 'https://www.waze.com/ul?ll=LAT,LON&z=17',
```

Departure, parking/walking and spectating arrival become separate chronological rows. Set departure to stage start minus driving, walking and the desired early arrival. No travel times are assumed for other stages. Video and map links appear only when supplied.

SS1: leave Kuressaare at 17:03, drive 32 minutes, park/start walking at 17:35, walk 10 minutes, arrive at 17:45, stage starts 18:15.

The Estonia clock refreshes every 15 seconds. On a rally day, a NOW line appears between elapsed and upcoming checkpoints; the next planned checkpoint is highlighted. This is a chronological list, not a proportional time scale. Reminders only work while the page is open; elapsed checkpoints do not imply that stages have finished.

Official schedule: https://saaremaarally.eu/en/for-spectators/ — checked 6 October 2026. All rally times are Estonia EEST (UTC+03:00).

SS4: leave Metsaääre, Kuusiku at 06:30, reach Aia 54 in Kuressaare at 07:00 and immediately continue, park/start walking at 07:35, reach the spectating spot at 07:55 (35 minutes early), stage starts 08:30. No stop duration at Aia 54 is included. The optional `stop` object stores the first drive duration, checkpoint label and Maps/Waze links; `travel.drivingMinutes` includes both drives.

SS7: leave SS4 spectating at 11:27, reach SS4 parking at 11:52, reach Kihelkonna at 12:02, stop for 15 minutes, leave at 12:17, reach SS7 parking at 12:32, and reach spectating at 12:37, 30 minutes before the 13:07 start. `journey` legs are calculated backwards from the stage start and `earlyArrivalMinutes`. SS7 parking and spectating Maps/Waze pins appear on the 12:17 and 12:32 checkpoints respectively. Journey legs select a stage pin using `destination: 'parking'` or `destination: 'spectating'`.

SS9: assuming a 30-minute early arrival (matching SS7), leave SS7 spectating at 15:01, reach SS7 parking at 15:06, drive 35 minutes to SS9 parking at 15:41, and walk 25 minutes to spectating at 16:06 before the 16:36 start. Maps/Waze pins appear at 15:06 for parking and 15:41 for spectating. Change SS9 `earlyArrivalMinutes` to adjust this assumed buffer.

The header theme button switches between light and dark. It follows the device theme until you choose one, then remembers your choice in local storage. If storage is unavailable the toggle still works for the current visit. `theme.js` applies the theme before the stylesheet loads.

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

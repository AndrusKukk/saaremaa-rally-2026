# Prediction game data

The active game uses Saaremaa Rally 2026's nine stages and the five-driver scoring rules from Colab. It scores the **overall rally standings after each stage**, including the provider's penalties and ranking, not individual stage times.

## Edit predictions

Edit `saaremaa/predictions.txt`. One line per player:

```
Andrus: Solberg, Evans, Pajari, Ogier, Neuville
```

Exactly five different surnames, in predicted order. Names match without regard to case or accents. These predictions are always read from this file, because the results provider does not hold your game predictions. The roster is Andrus, Kaido, Mihkel, Markus, Kenno and Madis. Leave a player’s value blank until they submit a prediction; they remain unranked and unscored.

## Emergency manual results

Edit `saaremaa/results.txt`:

```
SS1: Solberg, Ogier, Evans, Pajari, Neuville
```

Each line is the overall first through fifth AFTER that stage. Leave uncompleted stages out; do not enter zeroes or placeholders. Blank lines and lines beginning with `#` are ignored. Invalid/duplicate rows are reported and not scored. The active fallback file starts empty. The previous Sardinia demo files remain in `sardinia/` for reference and are not loaded.

Every refresh tries the live feed first. Valid live standings take precedence, stage by stage. Where a live stage cannot be loaded or validated, the manual file is used. If neither is available, a previously loaded result can remain in memory, explicitly labeled cached. With no result, scores display a dash and that stage contributes nothing. All sources are shown in the stage calculation panel. API errors never overwrite your text files.

Commit and push file edits to update GitHub Pages, wait for deployment, then tap Refresh results. Locally, serve the repository over HTTP; fetching text files will not work by opening index.html with a file:// URL. Files are public, so do not put private information in them.

## Scoring and limitations

For each actual top-five driver, exact prediction earns 25/18/15/12/10 according to actual position; one place off earns half; two or more places off earns 5; absent from prediction earns 0. Maximum score is 80. Each stage provides a fresh score against the overall standings after that stage; scores are never added across stages. The leaderboard uses the latest available stage, and SS9 determines the winner. The graph and table show historical scores, which can rise or fall. Equal scores share rank.

The historical overall endpoint is `/public/conversations/saaremaa-ralli-2026/results/standings?stage=STAGE_ID`; this avoids reconstructing standings by summing stage times. Source rankings without an unambiguous first through fifth or driver surname use fallback rather than guessing. Live provisional standings can change and are labeled accordingly. No betting locks or shared online prediction editing are implemented yet.

Results are fetched when you open the prediction view, reload the page, or press Refresh results. There is no automatic polling. There is no server/background job. Manual fallback protects against a results-provider failure; it is not a full offline app. Rules for cancelled stages/ties still need to be agreed before the live game.

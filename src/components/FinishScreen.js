export default function FinishScreen({ points, maxPossiblePoints, highscore }) {
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);
  let emoji;
  if (percentage === 100) emoji = "🥇";
  else if (percentage >= 80) emoji = "🎊";
  else if (percentage >= 50) emoji = "🙃";
  else if (percentage > 0) emoji = "😓";
  else emoji = "😨";
  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPossiblePoints} ({percentage}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
    </>
  )
}
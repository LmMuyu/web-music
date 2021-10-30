export default function countTime(time: number) {
  const minute = Math.floor(time >= 60 ? time / 60 : 0);
  const second = Math.floor(time >= 60 ? time % 60 : time);

  const DateList = [minute, second].map(String).map((time) => time.padStart(2, "0"));

  return DateList;
}

export function transformArtistData(artist: any) {
  return {
    coverImgUrl: artist.picUrl,
    name: artist.name,
    path: "/user/home",
    isPlayIcon: false,
    id: artist.id,
    style: {
      name: `
     font-weight:bold;
     color:#606266;
     font-size:18px;
     `,
    },
    xsize: 512,
    ysize: 512,
  };
}

import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import {
  getProfile,
  getPlaylists,
  getTopArtists,
  getTopTracks,
  getRecentlyPlayedTracks
} from '../spotify';
import {
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  PlaylistsGrid,
  RecentTrackList
} from '../components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getProfile();
      setProfile(userProfile.data);
  
      const userPlaylists = await getPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);

      const userRecentlyPlayedTracks = await getRecentlyPlayedTracks(10);
      setRecentlyPlayedTracks(userRecentlyPlayedTracks.data);
    };
  
    catchErrors(fetchData());
   }, []);

   console.log(recentlyPlayedTracks)

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <img className="header__img" src={profile.images[0].url} alt="Avatar"/>
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>{playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
            </div>
          </StyledHeader>

          {topArtists && topTracks && playlists && recentlyPlayedTracks && (
            <main>
              <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
                <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Top tracks this month" seeAllLink="/top-tracks">
                <TrackList tracks={topTracks.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Playlists" seeAllLink="/playlists">
                <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Recently played tracks" seeAllLink="/recent-tracks">
                <RecentTrackList items={recentlyPlayedTracks.items.slice(0, 10)} />
              </SectionWrapper>
            </main>
          )}
        </>
      )}
    </>
  )
};

export default Profile;
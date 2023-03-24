import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPlaylists } from '../spotify';
import { catchErrors } from '../utils';
import { SectionWrapper, PlaylistsGrid } from '../components';

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylists();
      setPlaylistsData(data);
      setPlaylists(data.items);
    };

    catchErrors(fetchData());
  }, []);

  // When playlistsData updates, check if there are more playlists to fetch
  // then update the state variable
  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    // Playlist endpoint only returns 20 playlists at a time, so we need to
    // make sure we get ALL playlists by fetching the next set of playlists
    const fetchMoreData = async () => {
      if (playlistsData.next && playlistsData.next !== null) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
        setPlaylists(() => [...(playlists ? playlists : []), ...data.items]);
      }
    };

    // Fetch next set of playlists as needed
    catchErrors(fetchMoreData());

  }, [playlistsData, playlists]);

  return (
    <main>
      <SectionWrapper title="Playlists" breadcrumb={true}>
        {playlists && (
          <PlaylistsGrid playlists={playlists} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;
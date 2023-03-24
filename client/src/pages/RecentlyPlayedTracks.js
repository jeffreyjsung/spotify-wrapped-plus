import { useState, useEffect } from 'react';
import { getRecentlyPlayedTracks } from '../spotify';
import { catchErrors } from '../utils';
import { SectionWrapper, RecentTrackList } from '../components';

const RecentlyPlayedTracks = () => {
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getRecentlyPlayedTracks(40);
      setRecentlyPlayedTracks(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <main>
      <SectionWrapper title="Recently played tracks" breadcrumb={true}>
        {recentlyPlayedTracks && recentlyPlayedTracks.items && (
          <RecentTrackList items={recentlyPlayedTracks.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default RecentlyPlayedTracks;
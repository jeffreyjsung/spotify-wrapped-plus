import { formatDuration } from '../utils';
import { StyledRecentTrackList } from '../styles';
import { formatDateTime } from '../utils';

const RecentTrackList = ({ items }) => (
  <>
    {items && items.length ? (
      <StyledRecentTrackList>
        {items.map((item, i) => (
          <li className="track__item" key={i}>
            <div className="track__item__num">{formatDateTime(item.played_at)}</div>
            <div className="track__item__title-group">
              {item.track.album.images.length && item.track.album.images[2] && (
                <div className="track__item__img">
                  <img src={item.track.album.images[2].url} alt={item.track.name} />
                </div>
              )}
              <div className="track__item__name-artist">
                <div className="track__item__name overflow-ellipsis">
                  {item.track.name}
                </div>
                <div className="track__item__artist overflow-ellipsis">
                  {item.track.artists.map((artist, i) => (
                    <span key={i}>
                      {artist.name}{i !== item.track.artists.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="track__item__album overflow-ellipsis">
              {item.track.album.name}
            </div>
            <div className="track__item__duration">
              {formatDuration(item.track.duration_ms)}
            </div>
          </li>
        ))}
      </StyledRecentTrackList>
    ) : (
      <p className="empty-notice">No tracks available</p>
    )}
  </>
);

export default RecentTrackList;
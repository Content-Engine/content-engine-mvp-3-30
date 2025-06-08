
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  duration: number;
  bpm: number;
  key: string;
  energy_level: string;
}

interface SongPickerProps {
  selectedSongId: string | null;
  onSongSelect: (songId: string) => void;
}

const SongPicker = ({ selectedSongId, onSongSelect }: SongPickerProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('title');

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSong = songs.find(song => song.id === selectedSongId);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="frosted-glass bg-gradient-to-br from-purple-500/20 to-blue-600/20 border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Music className="h-5 w-5 mr-2" />
          Select Background Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search songs by title, artist, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-card-subtle border-white/20 text-white placeholder:text-white/50"
        />

        <Select value={selectedSongId || ''} onValueChange={onSongSelect}>
          <SelectTrigger className="glass-card-subtle border-white/20 text-white">
            <SelectValue placeholder="Choose a song" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-gray-800 border-white/20">
            {loading ? (
              <SelectItem value="loading" disabled className="text-white/60">
                Loading songs...
              </SelectItem>
            ) : (
              filteredSongs.map((song) => (
                <SelectItem key={song.id} value={song.id} className="text-white hover:bg-white/10">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{song.title}</span>
                    <span className="text-white/60 text-sm">by {song.artist}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedSong && (
          <div className="glass-card-subtle p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">{selectedSong.title}</h4>
              <Badge className="bg-purple-500/20 text-purple-200">
                {formatDuration(selectedSong.duration)}
              </Badge>
            </div>
            <p className="text-white/70 text-sm">by {selectedSong.artist}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-blue-500/20 text-blue-200 text-xs">
                {selectedSong.genre}
              </Badge>
              <Badge className="bg-green-500/20 text-green-200 text-xs">
                {selectedSong.mood}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-200 text-xs">
                {selectedSong.bpm} BPM
              </Badge>
              <Badge className="bg-red-500/20 text-red-200 text-xs">
                {selectedSong.key}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongPicker;

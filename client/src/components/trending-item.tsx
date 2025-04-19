import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Music, Clock, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type TrendingHashtag = {
  tag: string;
  growth: number;
  category: string;
};

export type PopularSong = {
  title: string;
  artist: string;
  uses: string;
  platform: string;
};

export type BestPostTime = {
  day: string;
  time: string;
  engagement: string;
};

type TrendingHashtagsProps = {
  hashtags: TrendingHashtag[];
  className?: string;
};

type PopularSongsProps = {
  songs: PopularSong[];
  className?: string;
};

type BestPostTimesProps = {
  times: BestPostTime[];
  className?: string;
};

export function TrendingHashtags({ hashtags, className = "" }: TrendingHashtagsProps) {
  const { toast } = useToast();

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast({
      description: `Copied ${tag} to clipboard`,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Hash className="h-5 w-5 text-primary" />
          <CardTitle>Trending Hashtags</CardTitle>
        </div>
        <CardDescription>Popular hashtags to increase your reach</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hashtags.map((hashtag) => (
            <div key={hashtag.tag} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{hashtag.tag}</span>
                <Badge variant="outline">{hashtag.category}</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  +{hashtag.growth}%
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(hashtag.tag)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PopularSongs({ songs, className = "" }: PopularSongsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Music className="h-5 w-5 text-primary" />
          <CardTitle>Popular Songs</CardTitle>
        </div>
        <CardDescription>Trending audio to boost your content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{song.platform}</Badge>
                <span className="text-sm text-muted-foreground">{song.uses}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BestPostTimes({ times, className = "" }: BestPostTimesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Best Times to Post</CardTitle>
        </div>
        <CardDescription>Optimal posting schedule for maximum engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {times.map((timeSlot, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{timeSlot.day}</p>
                <p className="text-sm text-muted-foreground">{timeSlot.time}</p>
              </div>
              <Badge
                variant={
                  timeSlot.engagement === "High" || timeSlot.engagement === "Very High"
                    ? "secondary"
                    : "outline"
                }
                className={
                  timeSlot.engagement === "High" || timeSlot.engagement === "Very High"
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : timeSlot.engagement === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    : ""
                }
              >
                {timeSlot.engagement}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

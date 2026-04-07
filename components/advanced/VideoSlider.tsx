// components/advanced/VideoSlider.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type VideoPost = {
  type: string;
  videoId?: string;
  url?: string;
  title: string;
  thumbnail?: string;
  embedUrl?: string;
  watchUrl?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
};

type VideoSliderProps = {
  videos: VideoPost[];
  locale?: string;
  className?: string;
  currentVideo?: VideoPost | null;
  onVideoClose?: () => void;
  onVideoClick?: (video: VideoPost) => void;
};

export default function VideoSlider({
  videos,
  locale = "bn",
  className = "",
  currentVideo: externalCurrentVideo,
  onVideoClose,
  onVideoClick,
}: VideoSliderProps) {
  const [internalCurrentVideo, setInternalCurrentVideo] = useState<VideoPost | null>(null);
  const currentVideo = externalCurrentVideo ?? internalCurrentVideo;

  const handleVideoClick = (video: VideoPost) => {
    if (onVideoClick) {
      onVideoClick(video);
      return;
    }
    
    if (video.type === "youtube") {
      window.open(video.watchUrl || `https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
    } else if (video.type === "self-hosted" || video.type === "selfhosted") {
      setInternalCurrentVideo(video);
    } else if (video.type === "post") {
      if (video.embedUrl || video.url) {
        setInternalCurrentVideo(video);
      } else if (video.slug) {
        window.open(`/${locale}/${encodeURIComponent(video.slug)}`, "_self");
      }
    }
  };

  const getThumbnail = (video: VideoPost) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.featuredImage?.node?.sourceUrl) return video.featuredImage.node.sourceUrl;
    if (video.type === "youtube" && video.videoId) {
      return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
    }
    return null;
  };

  const getPlaceholderBg = (video: VideoPost) => {
    if (video.type === "youtube") {
      return "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)";
    } else if (video.type === "self-hosted" || video.type === "selfhosted") {
      return "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)";
    } else {
      return "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)";
    }
  };

  const hasVideos = videos && videos.length > 0;
  const hasMultipleVideos = videos && videos.length > 1;

  return (
    <div className={`${className} my-4 md:my-6`}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#6C1312] flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          {locale === "bn" ? "ভিডিও" : "Videos"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.slice(0, 8).map((video, index) => {
          const thumbnail = getThumbnail(video);
          
          return (
            <div
              key={index}
              onClick={() => handleVideoClick(video)}
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative aspect-video">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={video.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: getPlaceholderBg(video) }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#A41E22] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute top-2 left-2 px-2 py-1 bg-[#A41E22] text-white text-xs font-bold uppercase rounded">
                  {video.type === "youtube" 
                    ? (locale === "bn" ? "লাইভ" : "LIVE")
                    : (locale === "bn" ? "ভিডিও" : "VIDEO")
                  }
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#A41E22] line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {!externalCurrentVideo && internalCurrentVideo && (
        <>
          <div 
            className="fixed inset-0 z-[9980] bg-black/60 backdrop-blur-md"
            onClick={() => setInternalCurrentVideo(null)}
          />
          <div className="fixed inset-x-0 top-[100px] bottom-[80px] z-[9981] flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <div 
              className="relative w-full max-w-5xl h-full max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setInternalCurrentVideo(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              >
                ✕
              </button>
              <div className="w-full h-full bg-black flex items-center justify-center">
                <video
                  src={internalCurrentVideo.url || internalCurrentVideo.embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[70vh] object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform];
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      <Button variant="outline" size="sm" onClick={() => handleShare("twitter")} className="flex items-center gap-2" aria-label="Share on Twitter/X">
        <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter/ X</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare("facebook")} className="flex items-center gap-2" aria-label="Share on Facebook">
        <FontAwesomeIcon icon={faFacebook} className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")} className="flex items-center gap-2" aria-label="Share on LinkedIn">
        <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare("whatsapp")} className="flex items-center gap-2" aria-label="Share on WhatsApp">
        <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex items-center gap-2" aria-label="Copy link">
        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-4 w-4" />
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
      </Button>
    </div>
  );
}

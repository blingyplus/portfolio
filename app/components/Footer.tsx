"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a href="https://github.com/blingyplus" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                blingyplus
              </a>
              . The source code is available on{" "}
              <a href="https://github.com/blingyplus/portfolio" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/blingyplus" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="mailto:russelboakye@gmail.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
            <a href="https://wa.me/233240608256" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Image src="https://img.icons8.com/material-outlined/48/000000/whatsapp.png" alt="WhatsApp" width={20} height={20} className="dark:invert" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

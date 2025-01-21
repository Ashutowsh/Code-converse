"use client"
import { useProject } from '@/hooks/use-project'
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function DashBoard() {
  const {project} = useProject();


  return (
    <div>
      <div className='flex items-center justify-between flex-erap gap-y-4'>
        <div className='w-fit rounded-mg bg-primary px-4 py-3'>
          <div className="flex items-center">
            <Github className='size-5 text-white'/>
            <div className='ml-2'>
              <p className='text-sm font-medium text-wwhite'>
                This project is linked to {' '}
                <Link href={project?.githubUrl ?? ""} className='inline-flex items-center text-white hover:underline'/>
                <ExternalLink className='ml-1 size-4'/>
              </p>
            </div>
          </div>
        </div>

        <div className='h-4'></div>

        <div className='flex items-center gap-4'>
          TeamMembers
          InviteButton
          ArchiveButton
        </div>
      </div>

      <div className='mt-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
          AskQuestionCard
          MeetingCard
        </div>
      </div>

      <div className="mt-8"></div>
      CommitLog
    </div>
  )
}

export default DashBoard

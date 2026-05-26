import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import Projects from './Projects.jsx';
import { portfolioData } from '../data/portfolioData';

describe('Projects Component', () => {
  it('renders correctly', () => {
    render(<Projects />);

    // Check if the section heading is rendered
    expect(screen.getByText('Featured Projects')).toBeTruthy();

    // Check if all projects from portfolioData are rendered
    portfolioData.projects.forEach(project => {
      // Check for project title
      expect(screen.getByText(project.title)).toBeTruthy();

      // Check for project description
      expect(screen.getByText(project.description)).toBeTruthy();

      // Check for project tag
      expect(screen.getByText(project.tag)).toBeTruthy();

      // Check for technologies
      project.technologies.forEach(tech => {
        const techElements = screen.getAllByText(tech);
        expect(techElements.length).toBeGreaterThan(0);
      });
    });
  });

  it('renders external links correctly', () => {
    // The component wraps its content in a specific section
    const { container } = render(<Projects />);

    // Let's count how many total links the component rendered
    // The only links rendered should be from the projects data
    // unless another component like TiltCard or SectionHeading adds links (they don't in typical setups)
    const allLinks = Array.from(container.querySelectorAll('a'));

    // Calculate expected number of links based on portfolioData
    let expectedLinksCount = 0;
    portfolioData.projects.forEach(project => {
      if (project.links && project.links.github) expectedLinksCount++;
      if (project.links && project.links.live) expectedLinksCount++;
    });

    // Make sure we have the exact number of links
    expect(allLinks.length).toBe(expectedLinksCount);

    // Check if links have appropriate attributes for security
    allLinks.forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });
});

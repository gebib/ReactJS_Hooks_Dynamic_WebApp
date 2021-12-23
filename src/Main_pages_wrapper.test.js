import { render, screen } from '@testing-library/react';
import UI_Main_pages_wrapper from './UI_Main_pages_wrapper';
import React from "react";

test('renders learn react link', () => {
  render(<UI_Main_pages_wrapper />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

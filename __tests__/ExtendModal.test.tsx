import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExtendModal from '../components/ExtendModal';

describe('ExtendModal', () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    onExtend: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const { getByText } = render(<ExtendModal {...mockProps} />);
    expect(getByText('Extend Story')).toBeTruthy();
    expect(getByText('What should happen next?')).toBeTruthy();
    expect(getByText('Select Tone')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByText } = render(<ExtendModal {...mockProps} visible={false} />);
    expect(queryByText('Extend Story')).toBeFalsy();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = render(<ExtendModal {...mockProps} />);
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onExtend with content and tone when extend button is pressed', () => {
    const { getByDisplayValue, getByText } = render(<ExtendModal {...mockProps} />);
    
    const textInput = getByDisplayValue('');
    fireEvent.changeText(textInput, 'Test story content');
    
    const extendButton = getByText('Extend Story');
    fireEvent.press(extendButton);
    
    expect(mockProps.onExtend).toHaveBeenCalledWith('Test story content', 'DEFAULT');
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should disable extend button when content is empty', () => {
    const { getByText } = render(<ExtendModal {...mockProps} />);
    const extendButton = getByText('Extend Story');
    expect(extendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should show loading state', () => {
    const { getByText } = render(<ExtendModal {...mockProps} loading={true} />);
    expect(getByText('Extending...')).toBeTruthy();
  });
});
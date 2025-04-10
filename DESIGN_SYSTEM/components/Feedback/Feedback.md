# Feedback Components

Feedback components inform users about system status, progress, or errors.

## Components

**Status Indicators (`StatusIndicators.tsx`):**

- **`StatusDot`**: A simple colored dot indicating status (success, warning, error, info). Can have a pulsing animation.
- **`StatusTag`**: A small tag with a status color background, border, and text label. Includes a status dot and supports a loading state (pulsing dot).
- **`LoadingDots`**: A simple animation of three pulsing dots to indicate a generic loading state.
- **`ProgressBar`**: A visual indicator of progress, showing completion percentage.
  - Requires `ProgressBarContainer` as a parent.

**Messages & Notifications (`Feedback.tsx`):**

- **`ErrorContainer`**: A fixed-position container (typically bottom-center) for displaying messages (success, warning, error, info) with a glassmorphism background.
- **`ErrorCloseButton`**: A simple button often used within `ErrorContainer`.
- **`UploadProgressContainer`**: A fixed-position container (typically bottom-right) with a glassmorphism background, designed to show upload progress (using `UploadProgressBar` and `UploadProgressText`).
- **`UploadProgressBar`**: Styled div showing progress percentage (used within `UploadProgressContainer`).
- **`UploadProgressText`**: Styled div for displaying text related to upload progress.
- **`ConnectionStatusText`**: Simple styled text for displaying connection status.

## Props

**StatusDot Props:**

| Prop      | Type                                           | Default | Description                               |
| :-------- | :--------------------------------------------- | :------ | :---------------------------------------- |
| `status`  | `'success'`, `'warning'`, `'error'`, `'info'` | -       | **Required.** Sets the dot color.         |
| `pulsing` | `boolean`                                      | `false` | If true, applies a pulsing animation.     |

**StatusTag Props:**

| Prop      | Type                                           | Default | Description                               |
| :-------- | :--------------------------------------------- | :------ | :---------------------------------------- |
| `status`  | `'success'`, `'warning'`, `'error'`, `'info'` | -       | **Required.** Sets the tag color scheme.  |
| `loading` | `boolean`                                      | `false` | If true, the embedded dot pulses.         |

**ProgressBar Props:**

| Prop       | Type     | Default | Description                           |
| :--------- | :------- | :------ | :------------------------------------ |
| `progress` | `number` | -       | **Required.** Percentage (0-100).     |

**ErrorContainer Props:**

| Prop   | Type                                           | Default   | Description                                |
| :----- | :--------------------------------------------- | :-------- | :----------------------------------------- |
| `type` | `'success'`, `'warning'`, `'error'`, `'info'` | `'error'` | Sets the background color scheme.        |

**UploadProgressBar Props:** (Same as ProgressBar)

| Prop       | Type     | Default | Description                           |
| :--------- | :------- | :------ | :------------------------------------ |
| `progress` | `number` | -       | **Required.** Percentage (0-100).     |

## Usage

```jsx
import {
  StatusDot,
  StatusTag,
  LoadingDots,
  ProgressBarContainer,
  ProgressBar,
  ErrorContainer,
  ErrorCloseButton,
  UploadProgressContainer,
  UploadProgressBar,
  UploadProgressText,
  ConnectionStatusText
} from './Feedback'; // Assuming components are re-exported from an index file
import CloseIcon from '@mui/icons-material/Close'; // Example icon

function FeedbackExamples() {
  const [showError, setShowError] = React.useState(true);
  const [uploadProgress, setUploadProgress] = React.useState(65);

  return (
    <Column style={{ gap: tokens.spacing.lg }}>
      {/* Status Indicators */}
      <Row>
        <StatusDot status="success" /> Success
        <StatusDot status="warning" pulsing /> Warning (Pulsing)
        <StatusDot status="error" /> Error
        <StatusDot status="info" /> Info
      </Row>
      <Row>
        <StatusTag status="success">Connected</StatusTag>
        <StatusTag status="warning" loading>Processing</StatusTag>
        <StatusTag status="error">Failed</StatusTag>
        <StatusTag status="info">Updating</StatusTag>
      </Row>

      {/* Loading & Progress */}
      <Row>
        Loading: <LoadingDots />
      </Row>
      <ProgressBarContainer style={{ width: '200px' }}>
        <ProgressBar progress={75} />
      </ProgressBarContainer>

      {/* Connection Status */}
      <ConnectionStatusText>Status: Connected</ConnectionStatusText>

      {/* Error Message (Position Fixed) */}
      {showError && (
        <ErrorContainer type="error">
          <span>Failed to load resource.</span>
          <ErrorCloseButton aria-label="Close error" onClick={() => setShowError(false)}>
            <CloseIcon fontSize="inherit" />
          </ErrorCloseButton>
        </ErrorContainer>
      )}

      {/* Upload Progress (Position Fixed) */}
      <UploadProgressContainer>
        <UploadProgressText>Uploading file... {uploadProgress}%</UploadProgressText>
        <UploadProgressBar progress={uploadProgress} />
      </UploadProgressContainer>
    </Column>
  );
}
```

## Implementation Notes

- These components heavily utilize `tokens` for consistent styling (colors, spacing, radius, fonts).
- `ErrorContainer` and `UploadProgressContainer` use `position: fixed` and will overlay other content. Manage their visibility state appropriately.
- The pulsing animation uses `@emotion/react`'s `keyframes`.
- `ErrorContainer`, `StatusTag`, and `UploadProgressContainer` incorporate glassmorphism effects (`backdrop-filter`, transparent backgrounds).

## Accessibility

- Ensure text content within feedback components has sufficient contrast against the background.
- `LoadingDots` is decorative; consider providing screen reader announcements for loading states if necessary.
- Provide accessible labels for close buttons (`ErrorCloseButton`) using `aria-label`.
- For progress bars, consider using `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes on the `ProgressBarContainer` if it represents user-triggered progress. 
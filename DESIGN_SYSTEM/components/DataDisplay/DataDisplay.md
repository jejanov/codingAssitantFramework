# Data Display Components

These components are used for displaying data like user avatars or file information.

## Components

- **`Avatar`**: Displays a circular avatar, typically with initials or an image (though current implementation focuses on colored backgrounds with text content).
- **`FileAttachmentsContainer`**: A container for listing file attachments, usually within another component like a message bubble.
- **`FileAttachment`**: Represents a single file attachment item within the container.
- **`EmptyStateContainer`**: A container using `GlassPanel` styling to indicate when no data is available to display.
- **`EmptyStateIcon`**: A styled container for an icon within the `EmptyStateContainer`.
- **`EmptyStateIconSymbol`**: A styled container for the icon/emoji itself within `EmptyStateIcon`.
- **`EmptyStateTitle`**: Styled `h3` for the main title of the empty state message.
- **`EmptyStateDescription`**: Styled `p` for the descriptive text of the empty state message.

## Avatar Props

| Prop      | Type                                                              | Default     | Description                                                 |
| :-------- | :---------------------------------------------------------------- | :---------- | :---------------------------------------------------------- |
| `variant` | `'primary'`, `'secondary'`, `'success'`, `'error'`, `'warning'`, `'info'` | `'primary'` | Sets the background color scheme based on semantic colors. |
| `size`    | `'sm'`, `'md'`, `'lg'`                                           | `'md'`      | Sets the overall size and font size of the avatar.          |
| `children`| `ReactNode`                                                       | -           | Content displayed inside the avatar (e.g., initials).         |

## FileAttachment Props

This component typically takes standard `div` attributes (`className`, `style`, `onClick`) and `children`.

| Prop       | Type         | Default | Description                                             |
| :--------- | :----------- | :------ | :------------------------------------------------------ |
| `children` | `ReactNode`  | -       | Content of the file item (e.g., icon and file name). |
| `onClick`  | `() => void` | -       | Function called when the file item is clicked.         |

## EmptyStateContainer Props

Inherits `GlassProps` (see `components/Glass/Glass.md`) for styling.
Accepts standard `Box` props from MUI and `children`.

| Prop       | Type        | Default | Description                                    |
| :--------- | :---------- | :------ | :--------------------------------------------- |
| `children` | `ReactNode` | -       | Content of the empty state (Icon, Title, Desc). |

## Usage

```jsx
import {
  Avatar,
  FileAttachmentsContainer,
  FileAttachment,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateIconSymbol,
  EmptyStateTitle,
  EmptyStateDescription
} from './DataDisplay';
import FileIcon from '@mui/icons-material/ArticleOutlined'; // Example icon
import SearchOffIcon from '@mui/icons-material/SearchOff'; // Example icon

function UserProfile() {
  return (
    <Row style={{ alignItems: 'center' }}>
      <Avatar variant="primary" size="lg">JJ</Avatar>
      <Avatar variant="secondary" size="md">AI</Avatar>
      <Avatar variant="success" size="sm">S</Avatar>
    </Row>
  );
}

function MessageWithFiles() {
  const handleFileClick = (fileName) => {
    console.log(`Clicked on ${fileName}`);
  };

  return (
    <MessageBubble>
      <p>Please see the attached files:</p>
      <FileAttachmentsContainer>
        <FileAttachment onClick={() => handleFileClick('report.pdf')}>
          <FileIcon fontSize="inherit" style={{ marginRight: tokens.spacing.xs }} />
          report.pdf
        </FileAttachment>
        <FileAttachment onClick={() => handleFileClick('data.xlsx')}>
          <FileIcon fontSize="inherit" style={{ marginRight: tokens.spacing.xs }} />
          data.xlsx
        </FileAttachment>
      </FileAttachmentsContainer>
    </MessageBubble>
  );
}

function SearchResults({ results }) {
  if (results.length === 0) {
    return (
      <EmptyStateContainer hierarchy="container" level="secondary">
        <EmptyStateIcon>
          <EmptyStateIconSymbol>
            <SearchOffIcon fontSize="inherit" />
          </EmptyStateIconSymbol>
        </EmptyStateIcon>
        <EmptyStateTitle>No Results Found</EmptyStateTitle>
        <EmptyStateDescription>
          Try adjusting your search terms or filters.
        </EmptyStateDescription>
      </EmptyStateContainer>
    );
  }

  return (
    {/* Display results */}
  );
}
```

## Implementation Notes

- `Avatar` uses semantic colors for its background and includes a subtle border and inner highlight effect.
- `FileAttachment` uses a slight glassmorphism effect (`backdrop-filter`) and has hover/active states.
- `FileAttachmentsContainer` provides basic structure and styling for a list of `FileAttachment` items.
- `EmptyStateContainer` uses `GlassPanel` for its base styling, applying glassmorphism.
- `EmptyStateIcon`, `Title`, and `Description` provide structured styling for the empty state content.

## Accessibility

- **Avatar:** If the avatar content (children) is meaningful (e.g., initials representing a user), ensure it's appropriate. If it's purely decorative or used alongside a text name, consider `aria-hidden="true"`. If it conveys status, ensure that status is also available textually.
- **FileAttachment:** If the component is interactive (`onClick`), ensure it's keyboard-focusable and provides clear focus indication. The content should clearly identify the file.
- **Empty State:** Ensure the text content (`EmptyStateTitle`, `EmptyStateDescription`) clearly communicates the state to the user. The icon should ideally be decorative (`aria-hidden="true"`) if the text explains the state sufficiently. 
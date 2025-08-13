# News Image Upload to AWS S3

## Overview
The news management system now supports uploading images directly to AWS S3 storage. This provides better performance, scalability, and reliability for image storage.

## Features

### Frontend (NewsModal.jsx)
- **Drag & Drop Support**: Users can drag and drop images directly onto the upload area
- **Image Preview**: Real-time preview of selected images before upload
- **File Validation**: 
  - Supported formats: JPEG, JPG, PNG, GIF, WebP
  - Maximum file size: 5MB
- **Visual Feedback**: 
  - Loading states during image processing
  - Drag active states
  - Error messages for invalid files
- **Image Management**:
  - Remove existing images
  - Replace images during editing
  - Maintains existing image if no new image is selected

### Backend (NewsController.php)
- **S3 Integration**: Direct upload to AWS S3 bucket
- **Automatic URL Generation**: Stores full S3 URLs in database
- **Image Cleanup**: Automatically deletes old images when updating or deleting news
- **Error Handling**: Proper error responses for upload failures
- **Public Visibility**: Sets uploaded images to public for web access

## Configuration Required

### Backend (.env)
Make sure your Laravel `.env` file has the following AWS S3 configuration:

```bash
# Default filesystem disk (set to s3 for S3 storage)
FILESYSTEM_DISK=s3

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_USE_PATH_STYLE_ENDPOINT=false
```

### AWS IAM Permissions
Your AWS IAM user/role needs the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetObjectAcl",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name"
        }
    ]
}
```

## Usage

### Creating News with Image
1. Click "Create New News" button
2. Fill in the required fields (title, content, etc.)
3. Upload an image by:
   - Clicking the upload area and selecting a file
   - Dragging and dropping an image file onto the upload area
4. Preview will appear immediately after selection
5. Click "Create News" to save

### Editing News with Images
1. Click "Edit" on any news item
2. Existing image (if any) will be displayed in the preview
3. To replace the image:
   - Upload a new image using the same methods as above
   - The old image will be automatically deleted from S3
4. To remove the image:
   - Click the X button on the image preview
   - Leave the upload area empty
5. Click "Update News" to save changes

## Technical Implementation

### File Upload Process
1. **Frontend Validation**: File type and size validation before upload
2. **FormData Creation**: Always uses FormData for consistent backend handling
3. **S3 Upload**: Backend uploads to S3 with unique filename (timestamp + original name)
4. **URL Storage**: Full S3 URL stored in database for easy access
5. **Cleanup**: Old images automatically deleted when replaced or removed

### Error Handling
- Frontend shows user-friendly error messages for validation failures
- Backend provides detailed error responses for S3 upload issues
- Fallback images displayed when image loading fails

### Performance Optimizations
- Images served directly from S3 CDN
- No local storage requirements
- Automatic image compression handled by browser during preview
- Lazy loading in news table

## Testing

### Manual Testing Steps
1. Create a new news item with an image
2. Verify image appears in the news table
3. Edit the news and replace the image
4. Verify old image is no longer accessible and new image displays
5. Remove an image from existing news
6. Delete a news item with an image and verify S3 cleanup

### Troubleshooting
- **Image not uploading**: Check AWS credentials and bucket permissions
- **Image not displaying**: Verify S3 bucket policy allows public read access
- **Upload errors**: Check browser console for detailed error messages
- **Large file issues**: Ensure file size is under 5MB limit

## Security Considerations
- File type validation prevents malicious file uploads
- AWS IAM permissions limit S3 access to specific operations
- Images stored with public read access (required for web display)
- Automatic cleanup prevents orphaned files in S3

## Future Enhancements
- Image resizing/optimization before upload
- Multiple image support per news item
- Image alt text management
- Bulk image operations
- Advanced image editing features

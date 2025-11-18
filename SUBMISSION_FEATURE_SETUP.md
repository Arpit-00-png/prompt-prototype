# Work Submission Feature Setup

## What Was Added

A complete work submission system that allows:
- **Assignees** to upload their completed work (text + file links)
- **Task creators** to review the submitted work before approving/rejecting

## Database Migration Required

### Step 1: Run the Migration
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Open the file `supabase/add_submission_fields.sql`
4. Copy and paste the SQL into the editor
5. Click **Run** to execute

This adds three new fields to the `tasks` table:
- `submission_text` - Text content of the submission
- `submission_files` - JSON array of file URLs/links
- `submitted_at` - Timestamp when work was submitted

### Step 2: Verify
1. Go to **Table Editor** in Supabase
2. Click on the `tasks` table
3. Check that the new columns exist:
   - `submission_text` (text)
   - `submission_files` (jsonb)
   - `submitted_at` (timestamp)

## How It Works

### For Assignees (People who accepted the task):

1. **View Task**
   - Go to the task detail page
   - Click "Submit Work for Review" button

2. **Fill Submission Form**
   - **Work Submission** (Required): Describe your work, deliverables, results, etc.
   - **File Links** (Optional): Add links to files on Google Drive, Dropbox, GitHub, etc.
   - Click "Submit for Review"

3. **Status Changes**
   - Task status changes from `assigned` → `submitted`
   - Creator is notified and can review

### For Task Creators:

1. **Review Submission**
   - When status is `submitted`, you'll see a "Submitted Work" section
   - Review the text description
   - Click on file links to view/download files
   - Check submission timestamp

2. **Approve or Reject**
   - **Approve**: Releases escrowed tokens to assignee, increases their reputation
   - **Reject**: Refunds escrowed tokens back to you, decreases assignee reputation

## Workflow

```
Task Created (open)
    ↓
Someone Assigns (assigned)
    ↓
Assignee Submits Work (submitted) ← NEW: Work uploaded here
    ↓
Creator Reviews & Approves/Rejects
    ↓
Completed (completed) OR Back to Open (open)
```

## Features

✅ **Text Submission**: Rich text area for detailed descriptions  
✅ **File Links**: Support for multiple file URLs (Google Drive, Dropbox, GitHub, etc.)  
✅ **Submission Timestamp**: Track when work was submitted  
✅ **Review Interface**: Clean display of submitted work for creators  
✅ **Validation**: Requires at least text or file links before submission  

## Example Use Cases

### Example 1: Design Task
- **Text**: "Created logo design following brand guidelines. Used Adobe Illustrator. Colors match the palette provided."
- **Files**: Google Drive link to `.ai` and `.png` files

### Example 2: Code Task
- **Text**: "Implemented user authentication system. Added login, signup, and password reset features. All tests passing."
- **Files**: GitHub PR link, deployed app URL

### Example 3: Writing Task
- **Text**: "Completed blog post on topic X. 1500 words, SEO optimized, includes 3 images. Ready for review."
- **Files**: Google Docs link

## File Link Tips

The system accepts any URL, so you can use:
- **Google Drive**: Share link (make sure it's viewable)
- **Dropbox**: Share link
- **GitHub**: Repository or file links
- **OneDrive**: Share link
- **Any public URL**: Direct file links, portfolio links, etc.

**Note**: Make sure shared links are accessible to the task creator!

## Troubleshooting

### "Please provide submission content" Error
- You must provide either text OR at least one file link
- Both fields cannot be empty

### File Links Not Working
- Ensure the links are publicly accessible or shared with the creator
- Test the link in an incognito window first
- Use shareable links (not private/internal links)

### Submission Not Showing
- Refresh the page after submitting
- Check that the task status changed to "submitted"
- Verify you're logged in as the task creator

## Next Steps

After running the migration:
1. ✅ Test creating a task
2. ✅ Test assigning to a task
3. ✅ Test submitting work with text and file links
4. ✅ Test reviewing and approving/rejecting

The feature is now fully integrated and ready to use!


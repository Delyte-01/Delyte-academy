import {
  CourseFormData,
  CourseFormErrors,
} from "@/components/admin/courses/courseForm";

export function validateCourse(data: CourseFormData): CourseFormErrors {
  const errors: CourseFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Course title is required";
  }

  if (!data.code.trim()) {
    errors.code = "Course code is required";
  }

  if (!data.description.trim()) {
    errors.description = "Course description is required";
  }

  return errors;
}

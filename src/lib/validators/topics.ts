import {
  TopicFormData,
  TopicFormErrors,
} from "@/components/admin/topics/topic-form";

export function validateTopic(data: TopicFormData) {
  const errors: TopicFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  }

  if (!data.estimatedTime) {
    errors.estimatedTime = "Estimated time is required";
  }

  return errors;
}

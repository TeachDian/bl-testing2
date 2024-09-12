import { API_URL_WEB_CONTENTS } from "@/common/constants/api";
import { ApiService } from "@/common/services/api";
import { T_Update_Social_Links } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateSocialLinks(
  socialId: string | undefined,
  props: T_Update_Social_Links
) {
  const apiService = new ApiService("main");
  return await apiService.patch(
    `${API_URL_WEB_CONTENTS}/social-links/${socialId}`,
    props
  );
}

function useUpdateSocialLinks(socialId: string | undefined) {
  const query = useMutation({
    mutationFn: (props: T_Update_Social_Links) =>
      updateSocialLinks(socialId, props),
  });
  return query;
}

export default useUpdateSocialLinks;

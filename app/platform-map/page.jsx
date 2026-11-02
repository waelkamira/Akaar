import ModelRelationshipMap from "@/components/DatabaseUI/ModelRelationshipMap";

export const metadata = {
  title: "خريطة بنية أكار | Akaar",
  description: "خريطة صفحات الواجهة وعناصرها وعلاقاتها بمخطط Prisma.",
};

export default function PlatformMapPage() {
  return <ModelRelationshipMap />;
}

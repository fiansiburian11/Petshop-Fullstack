import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateItemPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#111418]" style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}>
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-[#293038] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">{/* Add Logo SVG Here */}</div>
            <h2 className="text-lg font-bold tracking-[-0.015em]">PetShop Admin</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9 text-sm font-medium text-white">
              {["Dashboard", "Orders", "Items", "Customers", "Marketing", "Settings"].map((label) => (
                <a href="#" key={label}>
                  {label}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              {["MagnifyingGlass", "Bell", "User", "Gear"].map((icon) => (
                <Button key={icon} className="bg-[#293038] text-white h-10 px-2.5">
                  {/* Icon SVG Placeholder */}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="w-full max-w-[960px] py-5">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white text-[32px] font-bold tracking-light">Create new item</p>
            </div>

            <div className="max-w-[480px] px-4 py-3">
              <label className="flex flex-col">
                <p className="pb-2 text-base font-medium text-white">Item name</p>
                <div className="flex w-full items-stretch rounded-xl">
                  <Input placeholder="E.g. Golden Retriever" className="rounded-r-none border-r-0 bg-[#1c2126] text-white placeholder:text-[#9dabb8] h-14" />
                  <div className="flex items-center justify-center rounded-r-xl border border-[#3c4753] bg-[#1c2126] pr-[15px] text-[#9dabb8]">{/* Question Icon */}</div>
                </div>
              </label>
            </div>

            <div className="max-w-[480px] px-4 py-3">
              <label className="flex flex-col">
                <p className="pb-2 text-base font-medium text-white">Description</p>
                <Textarea placeholder="E.g. Description..." className="min-h-36 bg-[#1c2126] text-white placeholder:text-[#9dabb8]" />
              </label>
            </div>

            <div className="max-w-[480px] px-4 py-3">
              <label className="flex flex-col">
                <p className="pb-2 text-base font-medium text-white">Price</p>
                <Input placeholder="$300" className="h-14 bg-[#1c2126] text-white placeholder:text-[#9dabb8]" />
              </label>
            </div>

            <div className="w-full p-4">
              <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-[#111418]">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/0443294a-fbc1-4a89-a08d-c7727dbcd85e.png")',
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-start px-4 py-3">
              <Button className="bg-[#293038] text-white">
                {/* Plus Icon */}
                Add images
              </Button>
            </div>

            <h3 className="px-4 pt-4 pb-2 text-lg font-bold text-white">Categories</h3>
            <div className="flex flex-wrap gap-3 p-3 pr-4">
              {["Dogs", "Cats", "Birds", "Fish", "Reptiles"].map((cat) => (
                <Button key={cat} variant="ghost" className="h-8 rounded-xl bg-[#293038] px-4 text-sm text-white">
                  {cat}
                  {/* CaretDown Icon */}
                </Button>
              ))}
            </div>

            <div className="flex justify-end px-4 py-3">
              <Button className="w-full bg-[#1980e6] text-white">Create item</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import axiosInstance from "@/lib/axios";
import { Product } from "../../../types/products";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface SearchingProps {
  onSearchResult: (results: Product[]) => void;
}

const Searching = ({ onSearchResult }: SearchingProps) => {
  const [keyword, setKeyword] = useState<string>("");

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get<{ data: Product[] }>(`/produk?search=${keyword}`);
      onSearchResult(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      onSearchResult([]);
    }
  };

  return (
    <div className="relative flex items-center pt-10 m-14">
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="rounded-2xl p-4" placeholder="Cari" />
      <Button type="button" onClick={handleSearch} className="absolute right-[3px] bg-[#FFA733] hover:bg-[#FFA733]/80 rounded-2xl p-4">
        <Search />
      </Button>
    </div>
  );
};

export default Searching;

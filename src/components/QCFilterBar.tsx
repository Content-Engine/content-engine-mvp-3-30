
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { QCFilters } from "@/types/qc";

interface QCFilterBarProps {
  filters: QCFilters;
  onFiltersChange: (filters: QCFilters) => void;
}

const QCFilterBar = ({ filters, onFiltersChange }: QCFilterBarProps) => {
  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as QCFilters['status']
    });
  };

  const handlePlatformChange = (value: string) => {
    onFiltersChange({
      ...filters,
      platform: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      dateRange: { start: '', end: '' },
      platform: 'all'
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.platform} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
            <SelectItem value="Facebook Reels">Facebook Reels</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Start date"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="End date"
          />
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default QCFilterBar;

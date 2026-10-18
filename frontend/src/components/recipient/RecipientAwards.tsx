import { AwardCard } from './AwardCard';
import { useRecipientAwards } from '../../hooks/useRecipientAwards';
import { ErrorState, Loading } from '../state/AsyncStates';
import './RecipientAwards.css';

/**
 * The signed-in recipient's awards across all known programmes.
 *
 * Reads on-chain: `get_award(recipient)` on each known programme. Sample
 * programmes fall back to their fixture entry, tagged as "Sample data".
 * AwardNotFound (19) from any programme is silently skipped — it is the
 * ordinary answer for a programme this recipient has no award in.
 *
 * Allocated awards also show the current escrow balance from
 * `allocation_of(recipient)`, read in the same pass.
 */
export function RecipientAwards() {
  const { awards, loading, error, refetch } = useRecipientAwards();

  if (loading) {
    return <Loading label="Reading your awards" rows={2} />;
  }

  if (error) {
    return <ErrorState error={error} contract="program" onRetry={refetch} />;
  }

  if (awards.length === 0) {
    return (
      <div className="recipient-awards__empty">
        No awards yet. Once an application is finalized, it appears here.
      </div>
    );
  }

  return (
    <div className="recipient-awards">
      {awards.map((award) => (
        <AwardCard
          key={award.programmeId}
          award={award}
        />
      ))}
    </div>
  );
}
